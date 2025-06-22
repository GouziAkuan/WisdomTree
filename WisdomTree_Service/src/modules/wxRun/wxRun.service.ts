import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createDecipheriv } from 'crypto';
import { ConfigService } from '@nestjs/config';
import {
  decryptDto,
  receiveEnergyDto,
  sessionInfo,
  todayInfo,
  wxRunRes,
} from './wxRun.dto';
import { HttpService } from '@nestjs/axios';
import {
  ApiResponse,
  ApiResponseSuccess,
} from 'src/common/interfaces/res.interface';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { EnergyEntity } from 'src/database/entities/energy.entity';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';
import { UserEntity } from 'src/database/entities/user.entity';
import https from 'https';

@Injectable()
export class wxRunService {
  constructor(
    @InjectRepository(EnergyEntity)
    private readonly energyRepository: Repository<EnergyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // 至少250步才有能量 保持最低能量5g够分配
  private MIN_STEPS: number = 250;
  // 设置最高步数，防止刷数据
  private MAX_STEPS: number = 20000;

  // 获取 session_key
  async getSessionKey(code: string): Promise<sessionInfo> {
    try {
      const appid = this.configService.get('WX_APPID');
      const secret = this.configService.get('WX_SECRET');
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;

      const { data } = await lastValueFrom(
        this.httpService.get(url, {
          httpsAgent: new https.Agent({
            rejectUnauthorized: false, // 跳过 SSL 验证（因为上线有影响 本地不影响）
          }),
        }),
      );
      if (data.errcode) throw new Error(data.errmsg);

      return {
        openid: data.openid,
        session_key: data.session_key,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('获取session_key失败', HttpStatus.BAD_REQUEST);
    }
  }

  // 微信运动数据解密
  decryptData(encryptedData: string, iv: string, sessionKey: string): wxRunRes {
    try {
      const decipher = createDecipheriv(
        'aes-128-cbc',
        Buffer.from(sessionKey, 'base64'),
        Buffer.from(iv, 'base64'),
      );
      decipher.setAutoPadding(true);

      const decoded = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, 'base64')),
        decipher.final(),
      ]).toString('utf8');

      return JSON.parse(decoded);
    } catch (error) {
      console.log(error);
      throw new HttpException('解密数据失败', HttpStatus.BAD_REQUEST);
    }
  }

  // 获取今日可领取的能量
  async decryptWeRunData(
    body: decryptDto,
    userId: number,
  ): Promise<ApiResponse<todayInfo>> {
    try {
      // 获取用户openid
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
      }

      // 1. 获取 sessionInfo
      const sessionInfo = await this.getSessionKey(body.code);

      // 检测到微信主体账号改变
      if (sessionInfo.openid !== user.openid) {
        return {
          status: HttpStatus.OK,
          code: 2,
          message: '微信号发生变更',
        };
      }

      // 2. 解密数据得到31天的微信数据
      const decryptedData: wxRunRes = this.decryptData(
        body.encryptedData,
        body.iv,
        sessionInfo.session_key,
      );

      // 3. 验证数据完整性
      if (
        decryptedData.watermark.appid !== this.configService.get('WX_APPID')
      ) {
        throw new Error('数据校验失败');
      }

      // 得到今天目前的步数
      let todaySteps =
        decryptedData.stepInfoList[decryptedData.stepInfoList.length - 1].step;

      todaySteps = todaySteps > this.MAX_STEPS ? this.MAX_STEPS : todaySteps;
      // 今日最新能量
      const energy =
        todaySteps >= this.MIN_STEPS ? Math.round(todaySteps / 50) : 0;

      // 如果今日步数不足250步，则返回
      if (energy === 0) {
        return {
          status: HttpStatus.OK,
          code: 0,
          message: '今日步数不足250步，暂无能量领取',
          data: {
            step: todaySteps,
          },
        };
      }

      // 获取今天日期
      const todayDate = dayjs().format('YYYY-MM-DD');

      // 得到今天之前的能量表数据
      const beforeTodaySteps = await this.energyRepository.findOne({
        where: { user: { id: userId }, date: todayDate },
      });

      if (beforeTodaySteps) {
        // 新老总能量差值
        const diffenergy = energy - beforeTodaySteps.energy;
        // 已领能量与老总能量差值
        const oldAddenergy =
          beforeTodaySteps.energy - beforeTodaySteps.receivedEnergy;
        if (diffenergy === 0 && oldAddenergy === 0) {
          return {
            status: HttpStatus.OK,
            code: 3,
            message: '暂无能量领取',
            data: {
              step: todaySteps,
            },
          };
        }
        // 更新数据库
        await this.energyRepository.update(
          { user: { id: userId }, date: todayDate },
          {
            energy: energy,
          },
        );
        return {
          status: HttpStatus.OK,
          code: 1,
          message: '有新能量可获取',
          data: {
            id: beforeTodaySteps.id,
            energy: diffenergy + oldAddenergy,
            step: todaySteps,
          },
        };
      } else {
        // 如果不存在，则创建一条新的记录
        const res = await this.energyRepository.save({
          user: { id: userId },
          energy: energy,
          receivedEnergy: 0,
          date: todayDate,
        });

        return {
          status: HttpStatus.OK,
          code: 1,
          message: '今日第一次能量刷新',
          data: { id: res.id, energy: energy, step: todaySteps },
        };
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error; // 直接传递已有异常
      }
      throw new HttpException('获取微信运动步数失败', HttpStatus.BAD_REQUEST);
    }
  }

  // 合并今日数据
  async mergeTodayData(
    body: decryptDto,
    userId: number,
  ): Promise<ApiResponseSuccess> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
      }
      // 1. 获取 sessionInfo
      const sessionInfo = await this.getSessionKey(body.code);

      // 2. 解密数据得到31天的微信数据
      const decryptedData: wxRunRes = this.decryptData(
        body.encryptedData,
        body.iv,
        sessionInfo.session_key,
      );

      // 3. 验证数据完整性
      if (
        decryptedData.watermark.appid !== this.configService.get('WX_APPID')
      ) {
        throw new Error('数据校验失败');
      }

      // 得到今天目前的步数
      let todaySteps =
        decryptedData.stepInfoList[decryptedData.stepInfoList.length - 1].step;

      todaySteps = todaySteps > this.MAX_STEPS ? this.MAX_STEPS : todaySteps;
      // 今日最新能量
      const energy =
        todaySteps >= this.MIN_STEPS ? Math.round(todaySteps / 50) : 0;

      // 获取今天日期
      const todayDate = dayjs().format('YYYY-MM-DD');

      // 更新数据库（存在则更新，不存在则插入）
      await this.energyRepository
        .createQueryBuilder()
        .insert()
        .into(EnergyEntity)
        .values({
          user: { id: userId },
          date: todayDate,
          energy: energy,
          receivedEnergy: 0,
          finish: false,
        })
        // 指定冲突字段及要覆盖的列
        .orUpdate(
          ['energy', 'receivedEnergy', 'finish'], // 要覆盖的列
          ['user', 'date'], // 冲突目标字段
          { skipUpdateIfNoValuesChanged: true }, // 可选
        )
        // 关键：关闭将返回值 merge 回实体的动作
        .updateEntity(false)
        .execute();

      // 更新用户openid
      await this.userRepository.update(
        { id: userId },
        {
          openid: sessionInfo.openid,
        },
      );

      return {
        status: HttpStatus.OK,
        code: 0,
        message: '已合并今日数据',
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error; // 直接传递已有异常
      }
      throw new HttpException('合并今日数据失败', HttpStatus.BAD_REQUEST);
    }
  }

  // 用户领取能量
  async receiveEnergy(
    body: receiveEnergyDto,
    userId: number,
  ): Promise<ApiResponseSuccess> {
    try {
      // 查询对应能量记录
      const energy = await this.energyRepository.findOne({
        where: { id: body.id, user: { id: userId } },
      });
      if (!energy) {
        throw new HttpException('能量不存在', HttpStatus.BAD_REQUEST);
      }

      // 如果还有剩余能量则更新
      if (energy.receivedEnergy < energy.energy) {
        // 如果领取的能量加上剩余能量等于总能量，则更新状态为完成
        if (energy.receivedEnergy + body.energy === energy.energy) {
          await this.energyRepository.update(
            { id: body.id, user: { id: userId } },
            {
              receivedEnergy: energy.energy,
              finish: true,
            },
          );
        }
        // 如果领取的能量加上剩余能量大于总能量，则更新状态为失败
        else if (energy.receivedEnergy + body.energy > energy.energy) {
          throw new HttpException('领取能量超出', HttpStatus.BAD_REQUEST);
        }
        // 如果领取的能量加上剩余能量小于总能量，则更新
        else if (energy.receivedEnergy + body.energy < energy.energy) {
          // 更新能量记录
          await this.energyRepository.update(
            { id: body.id, user: { id: userId } },
            {
              receivedEnergy: energy.receivedEnergy + body.energy,
            },
          );
        }
        // 查询用户表总能量
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        // 更新用户表的总能量
        await this.userRepository.update(
          { id: userId },
          { energy: user.energy + body.energy },
        );
        return {
          status: HttpStatus.OK,
          code: 0,
          message: `领取${body.energy}g能量成功`,
        };
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error; // 直接传递已有异常
      }
      throw new HttpException('领取能量失败', HttpStatus.BAD_REQUEST);
    }
  }
}
