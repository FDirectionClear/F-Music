import * as types from './mutation-types'

export const selectPlay = (
	{commit, state},
	{songList, index}
) => {
	commit(types.SET_FULLSCREEN, true)
	commit(types.SET_PLAYING, true)
	commit(types.SET_PLAYLIST, songList)
	commit(types.SET_SEQUENCELIST, songList)
	commit(types.SET_CURRENTINDEX, index)
}

