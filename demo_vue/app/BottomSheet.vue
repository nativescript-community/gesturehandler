<template>
    <GridLayout backgroundColor="red" height="100%" rows="70,50,*">
        <StackLayout row="0" backgroundColor="blue" />
        <StackLayout row="1" backgroundColor="green" />
        <CollectionView ref="listView" row="2" rowHeight="50" :items="Array.apply(null, {length: 100}).map(Number.call, Number)" @itemTap="onItemTap" @scroll="onListViewScroll" isBounceEnabled='false'>
            <v-template>
                <StackLayout class="item" orientation="horizontal">
                    <Label :text="item" class="title" verticalAlignment="center" />
                </StackLayout>
            </v-template>
        </CollectionView>
    </GridLayout>
</template>
<script lang="ts" src="./BottomSheet.ts"/>
