export function checkPosition(obj1, obj2) {
    return obj1.position.x + obj1.width / 2 >= obj2.position.x + obj2.width / 2;
}

export function checkAtk (obj1, obj2) {
    return obj1.atkbox.position.x + obj1.atkbox.width >= obj2.position.x
        && obj1.atkbox.position.x <= obj2.position.x + obj2.width
        && obj1.atkbox.position.y + obj1.atkbox.height >= obj2.position.y
        && obj1.atkbox.position.y <= obj2.position.y + obj2.height;
}