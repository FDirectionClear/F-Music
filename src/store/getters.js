export const singer = state => state.singer
export const fullscreen = state => state.fullscreen
export const playing = state => state.playing
export const playList = state => state.playList
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
export const currentSong = (state) => {
	// 如果当前没有歌曲，调用currentSong也不应返回undefined
	return state.playList[state.currentIndex] || {}
}
