// token的pinia模块
import {
	defineStore
} from 'pinia'
import {
	ref
} from 'vue'

export const medalStore = defineStore('medal', () => {
	// 勋章信息
	const medalInfo = ref({
		adoptionID: '',
		nickName: '',
		treeType: '',
		avatar: '',
	})

	// 保存勋章信息
	const saveMedalInfo = (info) => {
		medalInfo.value = info
	}

	//清空信息
	const clearMedalInfo = () => {
		// 对象每一项都为空
		Object.keys(medalInfo.value).forEach(key => {
			medalInfo.value[key] = ''
		})
	}

	return {
		medalInfo,
		saveMedalInfo,
		clearMedalInfo
	}
})