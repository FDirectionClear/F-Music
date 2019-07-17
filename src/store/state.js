import { playMode } from 'common/js/config'

const state = {
	singer: {}, // 当前专辑的歌手
	fullscreen: false, // 播放器是否显示全屏
	playing: false, // 播放器是否在播放
	playList: [],  // 当前播放列表
	sequenceList: [], //　当前播放列表（真实播放顺序）
	mode: playMode.sequence, // 当前播放模式，默认顺序播放
	currentIndex: -1 // 当前正在播放的歌曲索引，不播默认为-1
}
export default state


