var nave;

var balas;
var tiempoEntreBalas = 400;
var tiempo = 0;

var malos;
var timer;

var puntos;
var txtPuntos;

var vidas;
var txtVidas;


var explosion;
var sword;
var blaster;
var bgm;

var nivel = 1;
var txtNivel;

var Juego = {
	preload: function(){
		juego.load.image('bg', 'img/bg.png');
		juego.load.image('nave', 'img/player.png');
		juego.load.image('laser', 'img/laser.png');
		juego.load.image('malo', 'img/enemyUFO.png');
		
		
		juego.load.audio('explosion', 'audio/explosion.mp3');
		juego.load.audio('sword', 'audio/sword.mp3');
		juego.load.audio('blaster', 'audio/blaster.mp3');
		juego.load.audio('bgm', ['audio/bodenstaendig_2000_in_rock_4bit.mp3', 'audio/bodenstaendig_2000_in_rock_4bit.ogg']);
	},
	
	create: function(){
		/*--- BASE ---*/
		bg = juego.add.tileSprite(0,0,400,540,'bg');
		juego.physics.startSystem(Phaser.Physics.ARCADE);
		
		
		/*--- AUDIO ---*/			
		explosion = juego.add.audio('explosion');
		sword = juego.add.audio('sword');
		blaster = juego.add.audio('blaster');
		bgm = juego.add.audio('bgm');
		bgm.play();
		
		/*--- NAVE ---*/
		nave = juego.add.sprite(juego.width/2,485,'nave');
		nave.anchor.setTo(0.5);
		juego.physics.arcade.enable(nave, true);
		
		/*--- BALAS ---*/
		balas = juego.add.group();
		balas.enableBody = true;
		balas.setBodyType = Phaser.Physics.ARCADE;
		balas.createMultiple(50,'laser');
		balas.setAll('anchor.x',0.5);
		balas.setAll('anchor.y',0.5);
		balas.setAll('checkWorldBounds', true); balas.setAll('outOfBoundsKill', true);
		
		/*--- ENEMIGOS ---*/
		malos = juego.add.group();
		malos.enableBody = true;
		malos.setBodyType = Phaser.Physics.ARCADE;
		malos.createMultiple(50,'malo');
		malos.setAll('anchor.x',0.5);
		malos.setAll('anchor.y',0.5);
		malos.setAll('checkWorldBounds', true);
		malos.setAll('outOfBoundsKill', true);
		timer = juego.time.events.loop(2000/(nivel**3),this.crearEnemigo,this);
		
		/*--- DISPLAY NIVEL ---*/
		nivel = 1;
		juego.add.text(310,40,"Nivel: ",{ font:"14px Arial", fill:"#FFF" });
		txtNivel = juego.add.text(360,40,"1",{ font:"14px Arial", fill:"#FFF" });
		
		/*--- DISPLAY PUNTOS ---*/
		puntos = 0;
		juego.add.text(20,20,"Puntos: ",{ font:"14px Arial", fill:"#FFF" });
		txtPuntos = juego.add.text(80,20,"0",{ font:"14px Arial", fill:"#FFF" });
		
		/*--- DISPLAY VIDAS ---*/
		vidas = 3;
		juego.add.text(310,20,"Vidas: ",{ font:"14px Arial", fill:"#FFF" });
		txtVidas = juego.add.text(360,20,"3",{ font:"14px Arial", fill:"#FFF" });
	},
	
	update: function(){
		/*--- MOVIMIENTO FONDO ---*/
		bg.tilePosition.y+=1;
		
		/*--- CONTROL NAVE ---*/
		nave.rotation=juego.physics.arcade.angleToPointer(nave) + Math.PI/2;
		
		if (juego.input.activePointer.isDown){
			this.disparar();
		}
		
		/*--- COLISIÓN ---*/
		juego.physics.arcade.overlap(balas
		,malos,this.colision,null,this);
		
		/*--- VIDAS ---*/
		malos.forEachAlive(function(m){
			if (m.position.y > 520 && m.position.y < 523){
				m.kill;
				vidas -=1;
				txtVidas.text = vidas;
				explosion.play();
			}
		});
		
		if (vidas == 0){
			juego.state.start('Terminado');
		}
		
							
		if (nivel == 3){
			juego.state.start('TerminadoGood');
		}
	},
	
	/*--- FUNCIONES PERSONALIZADAS ---*/
	disparar: function(){
		if ((juego.time.now > tiempo) && (balas.countDead() > 0)){
			tiempo = juego.time.now + tiempoEntreBalas;
			
			var bala=balas.getFirstDead();
			bala.anchor.setTo(0.5);
			bala.reset(nave.x, nave.y);
			bala.rotation=juego.physics.arcade.angleToPointer(bala) + Math.PI/2;
			juego.physics.arcade.moveToPointer(bala,200);
		}
		
		blaster.play();
	},
	
	crearEnemigo: function(){
		var enem = malos.getFirstDead();
		var num = Math.floor( Math.random()*10 + 1 );
		
		enem.anchor.setTo(0.5);
		enem.reset(num*38, 0);
		enem.body.velocity.y = 100+(20*nivel);
		enem.checkWorldBounds = true;
		enem.outOfBoundsKill = true;
	},
	
	colision: function(bala,enemigo){
		bala.kill();
		enemigo.kill();
		
		puntos++;
		txtPuntos.text = puntos;
		
		sword.play();
		
		if (puntos == 5){
			puntos = 0;
			txtPuntos.text = puntos;
			nivel +=1;
			txtNivel.text = nivel;
			}
	}
};