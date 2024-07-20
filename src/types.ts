export interface user {
    name: string;
    color: string;
    profile: string;
}
export interface room {
    roomid: string;
    name: string;
    info: string;
    tags: string[];
}
export interface nowroominfo {
    roomid: room['roomid'];
    users: user[];
    peoples: number;
    rommers: number;
}
export interface massage {
    massageid: string;
    roomid: room['roomid'];
    userid: user['name'];
    text: string;
    time: number;
    type: string;
}