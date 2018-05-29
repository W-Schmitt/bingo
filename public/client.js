let vm;

const dummyBingo = { tiles: [{ word: 'Kick off', ticked: false }, { word: 'ETA', ticked: false }, { word: 'One to one', ticked: false }, { word: 'Backend', ticked: false }, { word: 'Forward', ticked: false }, { word: 'Call', ticked: false }, { word: 'Meeting', ticked: false }, { word: 'Project', ticked: false }, { word: 'Focus', ticked: false }, { word: 'Bridge', ticked: false }, { word: 'Component', ticked: false }, { word: 'Frontend', ticked: false }, { word: null, ticked: true }, { word: 'Survey', ticked: false }, { word: 'Reporting', ticked: false }, { word: 'Process', ticked: false }, { word: 'Cockpit', ticked: false }, { word: 'WIP', ticked: false }, { word: 'Customer', ticked: false }, { word: 'Monthly', ticked: false }, { word: 'Late/early', ticked: false }, { word: 'Review', ticked: false }, { word: 'Challenge', ticked: false }, { word: 'Highlight', ticked: false }, { word: 'Device', ticked: false }] };

const xhrHandlers = {
  getNewBingo: () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/api/v0/bingo/new');
    xhr.onload = () => xhr.response;
    xhr.send();
  },
};

// xhrHandlers.getNewBingo();

Vue.component('bingo-tile', {
  template: '\
    <div class="col bingo-tile border align-items-center h-100"\
      v-bind:class="{ ticked: ticked }"\
      v-on:click="tick">\
      <p class="bingo-tile-content">{{ word || \' \'}}</p>\
    </div>\
  ',
  props: ['word', 'ticked', 'id'],
  methods: {
    tick: function () {
      vm.tick(this.id);
    },
  },
});

Vue.component('bingo-line', {
  template: '\
    <div class="row bingo-row align-items-center">\
      <bingo-tile v-for="tile in tiles" :key="tile.word" v-bind:word="tile.word" v-bind:ticked="tile.ticked" v-bind:id="tile.id"></bingo-tile>\
    </div>\
  ',
  props: ['tiles'],
});

vm = new Vue({
  el: '#bingo',
  data: function () { return bingo; },
  computed: {
    colCount: function () {
      return Math.floor(Math.sqrt(this.tiles.length));
    },
    reshapedBingo: function () {
      const res = { lines: [] };
      for (let i = 0; i < this.tiles.length; i++) {
        if (i % this.colCount === 0) res.lines.push({ tiles: [] });
        res.lines[Math.floor(i / this.colCount)].tiles.push(this.tiles[i]);
      }
      return res;
    },
  },
  methods: {
    tick: function (id) {
      if (this.tiles[id].word) {
        this.tiles[id].ticked = !this.tiles[id].ticked;
        const rowNr = Math.floor(id / this.colCount);
        const colNr = id % this.colCount;
        this.isWinningTick(colNr, rowNr);
      }
    },
    isWinningTick: function (colNr, rowNr) {
      let winningCol = true;
      for (let i = colNr; i < this.tiles.length && winningCol; i += this.colCount) {
        winningCol = winningCol && this.tiles[i].ticked;
      }
      if (winningCol) console.log(`Column ${colNr} is gud`);
      let winningLine = true;
      for (let i = 0; i < this.reshapedBingo.lines[rowNr].tiles.length && winningLine; i++) {
        winningLine = winningLine && this.reshapedBingo.lines[rowNr].tiles[i].ticked;
      }
      if (winningLine) console.log(`Row ${rowNr} is gud`);
    },
  },
});
