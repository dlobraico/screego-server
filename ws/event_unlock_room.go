package ws

import (
	"bytes"
	"fmt"

	"github.com/screego/server/ws/outgoing"
)

func init() {
	register("unlockroom", func() Event {
		return &UnlockRoom{}
	})
}

type UnlockRoom struct {
}

func (e *UnlockRoom) Execute(rooms *Rooms, current ClientInfo) error {
	if current.RoomID == "" {
		return fmt.Errorf("not in a room")
	}

	room, ok := rooms.Rooms[current.RoomID]
	if !ok {
		return fmt.Errorf("room with id %s does not exist", current.RoomID)
	}

	room.Locked = false
	for id, session := range room.Sessions {
		if bytes.Equal(session.Host.Bytes(), current.ID.Bytes()) {
			client, ok := room.Users[session.Client]
			if ok {
				client.Write <- outgoing.RoomUnlocked(id)
			}
		}
	}

	room.notifyInfoChanged()
	return nil
}
