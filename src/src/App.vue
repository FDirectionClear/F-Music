<template>
    <section id = "app">
		<header-bar></header-bar>
		<Tab></Tab>
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
		<player></player>
    </section>
</template>

<script>
import HeaderBar from 'components/header-bar/header-bar'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
	components:{
		HeaderBar,
		Tab,
		Player
	}
}
</script>

<style lang="stylus" scoped>
</style>

