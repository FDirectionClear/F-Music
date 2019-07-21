import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/tools'

const {
	sequence,
	loop,
	random
} = playMode

export const selectPlay = (
	{commit, state},
	{songList, index}
) => {
	if(state.mode === playMode.random) {
		// 应该判断当前模式是否为random，如果不对random模式下特殊处理
		// 在当我们在random模式下再次点击song-list中的某一个歌曲时，就会
		// 出现虽然显示的是random模式，但是播放的模式却是sequence模式。
		//  导致这个现象，是因为我们在上一次播放时切换为random，但是在
		//  下一次从song-list上选择歌曲时，又会通过selectPlay函数重新将
		//  playList变成和sequenceList一样的顺序列表，因而我们在这里需要冲洗
		// 对歌曲的播放列表进行 ”洗牌“。
		var list = shuffle(state.sequenceList)
		index = list.findIndex(
			curr => curr === state.sequenceList[index]
		)
	} else {
		var list = songList
	}
	commit(types.SET_FULLSCREEN, true)
	commit(types.SET_PLAYING, true)
	commit(types.SET_SEQUENCELIST, list)
	commit(types.SET_PLAYLIST,  list)
	commit(types.SET_CURRENTINDEX, index)
}

export const setPlayMode = (
	{commit, state},
	mode
) => {
	switch (mode) {
		case sequence :
			// 防止从random -> sequence会造成currentIndex改变，从而直接切歌
			var newIndex= state.sequenceList.findIndex(
				curr => curr === state.playList[state.currentIndex]
			)
			commit(types.SET_MODE, mode)
			commit(types.SET_PLAYLIST, state.sequenceList)
			commit(types.SET_CURRENTINDEX, newIndex)
			break
		case loop :
			commit(types.SET_MODE, mode)
			break
		case random :
			// 防止从sequence -> random会造成currentIndex改变，从而直接切歌
			const list = shuffle(state.sequenceList)
			var newIndex= list.findIndex(
				curr => curr === state.playList[state.currentIndex]
			)
			commit(types.SET_MODE, mode)
			commit(types.SET_PLAYLIST, list)
			commit(types.SET_CURRENTINDEX, newIndex)
			break
	}
}
