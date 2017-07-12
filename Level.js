function Level (){
  this.sprites = [];
  this.shots = [];
  this.num_players = 2;
  for (var i = 0; i < this.num_players; ++i)
    this.shots[i] = [];
  this.inimigos = 3;
}

Level.prototype.init = function () {
  //for (var i = 0; i < this.inimigos; i++) {
  //  var inimigo = new Sprite();
  //  inimigo.x = 120+20*i;
  //  inimigo.y = 10;
  //  inimigo.width = 32;
  //  inimigo.height = 32;
    //inimigo.vang = 300*i;
    //inimigo.am = 00;
    //inimigo.imgkey = "enemy";
    //this.sprites.push(inimigo);
 // }
 //Wall 1 
 var wall = new Sprite();
 wall.x = 120;
 wall.y = 0;
 wall.width = 20;
 wall.height = 600;
 wall.am = 0;
 this.sprites.push(wall);
 //Wall 2
 wall = new Sprite();
 wall.x = 450;
 wall.y = 300;
 wall.width = 20;
 wall.height = 300;
 wall.am = 0;
 this.sprites.push(wall);
 //Wall 3
 wall = new Sprite();
 wall.x = 340;
 wall.y = 160;
 wall.width = 200;
 wall.height = 20;
 wall.am = 0;
 this.sprites.push(wall);
};

Level.prototype.mover = function (dt) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].mover(dt);
    }
    for (var j = this.shots.length-1; j>=0; j--) {
      for (var i = this.shots[j].length-1;i>=0; i--) {
        this.shots[j][i].mover(dt);
        if(
          this.shots[j][i].x >  3000 ||
          this.shots[j][i].x < -3000 ||
          this.shots[j][i].y >  3000 ||
          this.shots[j][i].y < -3000
        ){
          this.shots[j].splice(i, 1);
        }
      }
    }
};

Level.prototype.moverAng = function (dt) {
  for (var j = this.shots.length-1; j >= 0; j--) {
    for (var i = this.shots[j].length-1; i >= 0; i--) {
      this.shots[j][i].moverAng(dt);
      if(
        this.shots[j][i].x >  3000 ||
        this.shots[j][i].x < -3000 ||
        this.shots[j][i].y >  3000 ||
        this.shots[j][i].y < -3000
      ){
        this.shots[j].splice(i, 1);
      }
    }
  }
};

Level.prototype.desenhar = function (ctx) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].desenhar(ctx);
    }
    for (var j = 0; j < this.shots.length; j++) {
      for (var i = 0; i < this.shots[j].length; i++) {
        this.shots[j][i].desenhar(ctx);
      }
    }
};
Level.prototype.desenharImg = function (ctx) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].desenhar(ctx);
    }
    for (var j = 0; j < this.shots.length; j++) {
      for (var i = 0; i < this.shots[j].length; i++) {
        this.shots[j][i].desenharImg(ctx, this.imageLib.images[this.shots[j][i].imgkey]);
      }
    }
};

Level.prototype.colidiuCom = function (alvo, resolveColisao) {
    for (var i = 0; i < this.sprites.length; i++) {
      if(alvo.colidiuCircleBox(this.sprites[i])){
        resolveColisao(this.sprites[i], alvo);
      }
    }
};

Level.prototype.colidiuComPlayer = function (alvo, resolveColisao, player) {
      if(alvo.colidiuCircleBox(player)){
        resolveColisao(player, alvo);
      }
};

Level.prototype.perseguir = function (alvo, dt) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].perseguir(alvo,dt);
  }
};
Level.prototype.perseguirAng = function (alvo, dt) {
  for (var i = 0; i < this.sprites.length; i++) {
    this.sprites[i].perseguirAng(alvo,dt);
  }
};

Level.prototype.fire = function (alvo, audiolib, key, vol, num_player){
  if(alvo.cooldown>0) return;
  var tiro = new Sprite();
  tiro.x = alvo.x;
  tiro.y = alvo.y;
  tiro.angle = alvo.angle;
  tiro.am = 100;
  tiro.width = 8;
  tiro.height = 16;
  tiro.radius = 6;
  tiro.imgkey = "shot";
  this.shots[num_player].push(tiro);
  alvo.cooldown = 1;
  if(audiolib && key) audiolib.play(key,vol);
}

Level.prototype.colidiuComTirosCenario = function(al, key){

  for(var j = this.shots.length-1; j>=0; j--){
    for(var i = this.shots[j].length-1; i>=0; i--){

        this.colidiuCom(this.shots[j][i],
        (
          function(that)
          {
          return function(alvo){
            that.shots[j].splice(i,1);
            if(al&&key) al.play(key);
          }
        }
      )(this));
  }
  }
}

Level.prototype.colidiuComTiros = function(al, key, num_player, player){

  for(var i = 0; i < this.shots.length; ++i) {
    for(var j = 0; j < this.shots[i].length; ++j) {
      if(i != num_player){
        if(this.shots[i][j].colidiuCircleBox(player)){
          console.log("entrou aqui");
          this.shots[i][j].x = 30000;
          if(player.placar != 0)
            player.placar = player.placar - 1;
          if(al&&key) al.play(key);
        }  
      }
    }
  }
}




//
