export function checkPosition(obj1, obj2) {
    return obj1.position.x + obj1.width / 2 >= obj2.position.x + obj2.width / 2;
}

export function checkAtk (obj1, obj2) {
    return obj1.atkBox.position.x + obj1.atkBox.width >= obj2.position.x
        && obj1.atkBox.position.x <= obj2.position.x + obj2.width
        && obj1.atkBox.position.y + obj1.atkBox.height >= obj2.position.y
        && obj1.atkBox.position.y <= obj2.position.y + obj2.height;
}