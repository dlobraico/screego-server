package ws

import (
	"bytes"
	"fmt"

	"github.com/screego/server/ws/outgoing"
)

func init() {
	register("lockroom", func() Event {
		return &LockRoom{}
	})
}

type LockRoom struct {
}

func (e *LockRoom) Execute(rooms *Rooms, current ClientInfo) error {
	if current.RoomID == "" {
		return fmt.Errorf("not in a room")
	}

	room, ok := rooms.Rooms[current.RoomID]
	if !ok {
		return fmt.Errorf("room with id %s does not exist", current.RoomID)
	}

	room.Locked = true
	for id, session := range room.Sessions {
		if bytes.Equal(session.Host.Bytes(), current.ID.Bytes()) {
			client, ok := room.Users[session.Client]
			if ok {
				client.Write <- outgoing.RoomLocked(id)
			}
		}
	}

	room.notifyInfoChanged()
	return nil
}
