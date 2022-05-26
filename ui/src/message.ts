export enum ShareMode {
    Everyone = 'Everyone',
    Selected = 'Selected',
}

type Typed<Base, Type extends string> = {type: Type; payload: Base};

export interface UIConfig {
    authMode: 'turn' | 'none' | 'all';
    user: string;
    loggedIn: boolean;
    version: string;
    closeRoomWhenOwnerLeaves: boolean;
}

export interface RoomConfiguration {
    id?: string;
    closeOnOwnerLeave?: boolean;
    mode: RoomMode;
    username?: string;
}

export enum RoomMode {
    Turn = 'turn',
    Stun = 'stun',
    Local = 'local',
}

export interface JoinConfiguration {
    id: string;
    password?: string;
    username?: string;
}

export interface StringMessage {
    message: string;
}

export interface P2PSession {
    id: string;
    peer: string;
    iceServers: ICEServer[];
}

export interface ICEServer {
    urls: string[];
    credential: string;
    username: string;
}

export interface RoomInfo {
    id: string;
    share: ShareMode;
    mode: RoomMode;
    users: RoomUser[];
    locked : boolean;
}

export interface RoomUser {
    id: string;
    name: string;
    streaming: boolean;
    you: boolean;
    owner: boolean;
}

export interface P2PMessage<T> {
    sid: string;
    value: T;
}

export type Room = Typed<RoomInfo, 'room'>;
export type Error = Typed<StringMessage, 'Error'>;
export type HostSession = Typed<P2PSession, 'hostsession'>;
export type Name = Typed<{username: string}, 'name'>;
export type ClientSession = Typed<P2PSession, 'clientsession'>;
export type HostICECandidate = Typed<P2PMessage<RTCIceCandidate>, 'hostice'>;
export type ClientICECandidate = Typed<P2PMessage<RTCIceCandidate>, 'clientice'>;
export type HostOffer = Typed<P2PMessage<RTCSessionDescriptionInit>, 'hostoffer'>;
export type ClientAnswer = Typed<P2PMessage<RTCSessionDescriptionInit>, 'clientanswer'>;
export type StartSharing = Typed<{}, 'share'>;
export type StopShare = Typed<{}, 'stopshare'>;
export type RoomCreate = Typed<RoomConfiguration & {joinIfExist?: boolean}, 'create'>;
export type JoinRoom = Typed<JoinConfiguration, 'join'>;
export type EndShare = Typed<string, 'endshare'>;
// CR dlobraico: It would be tidier if there were just two messages
// "SetLockStatus" and "LockStatusSet", with bool payloads indicating the lock
// status.
export type LockRoom = Typed<string, 'lockroom'>;
export type UnlockRoom = Typed<string, 'unlockroom'>;
export type RoomLocked = Typed<string, 'roomlocked'>;
export type RoomUnlocked = Typed<string, 'roomunlocked'>;

export type IncomingMessage =
    | Room
    | Error
    | HostSession
    | ClientSession
    | HostICECandidate
    | ClientICECandidate
    | HostOffer
    | EndShare
    | ClientAnswer
    | RoomLocked
    | RoomUnlocked;

export type OutgoingMessage =
    | RoomCreate
    | Name
    | JoinRoom
    | HostICECandidate
    | ClientICECandidate
    | HostOffer
    | StopShare
    | ClientAnswer
    | StartSharing
    | LockRoom
    | UnlockRoom;
