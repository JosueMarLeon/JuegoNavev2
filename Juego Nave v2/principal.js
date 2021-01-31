window.PhaserGlobal = {
  disableWebAudio: true
};

var juego = new Phaser.Game(400, 540, Phaser.CANVAS, 'bloque_juego');

//Agregando los estados del juego
juego.state.add('Juego', Juego);
juego.state.add('Terminado', Terminado);
juego.state.add('TerminadoGood', TerminadoGood);

//Inicializamos juego en el estado Juego
juego.state.start('Juego');