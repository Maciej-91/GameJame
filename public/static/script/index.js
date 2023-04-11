		import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"
		kaboom()
    loadRoot("/static/img/")
		loadSprite("ship", "starship3.png");

add([
    sprite("ship"),
    pos(80, 40),
    area()
]);