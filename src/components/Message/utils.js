// exclude uid === null
export function createRoomID(uid1, uid2) {
    if (typeof(uid1) === 'string' && typeof(uid2) === 'string') {
        if (uid1 < uid2) {
            return uid1 + uid2;
        }
        else {
            return uid2 + uid1;
        }
    } else {
        return false
    }
}