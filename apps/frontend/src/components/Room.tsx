import React, { useState, useEffect, useRef } from "react";
import { socket } from "../services/socket";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

export const Room: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [isCallReady, setIsCallReady] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // --- Handle join/leave events ---
  useEffect(() => {
    const handleUserJoined = async (userId: string) => {
      setEvents((prev) => [
        `User joined: ${userId}`,
        ...prev,
      ]);
      // If you are the second user, start the call
      if (joinedRoom && localStreamRef.current) {
        await startCall();
      }
    };
    const handleUserLeft = (userId: string) => {
      setEvents((prev) => [
        `User left: ${userId}`,
        ...prev,
      ]);
      endCall();
    };
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
    };
    // eslint-disable-next-line
  }, [joinedRoom]);

  // --- Handle signaling ---
  useEffect(() => {
    const handleSignal = async ({ data }: { data: RTCSessionDescriptionInit | RTCIceCandidateInit }) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;
      if ((data as RTCSessionDescriptionInit).type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data as RTCSessionDescriptionInit));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("signal", { roomId: joinedRoom, data: pc.localDescription });
      } else if ((data as RTCSessionDescriptionInit).type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data as RTCSessionDescriptionInit));
      } else if ((data as RTCIceCandidateInit).candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data as RTCIceCandidateInit));
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      }
    };
    socket.on("signal", handleSignal);
    return () => {
      socket.off("signal", handleSignal);
    };
    // eslint-disable-next-line
  }, [joinedRoom]);

  // --- Join room and get local media ---
  const joinRoom = async () => {
    if (roomId.trim()) {
      socket.emit("join-room", roomId);
      setJoinedRoom(roomId);
      setEvents((prev) => [
        `You joined room: ${roomId}`,
        ...prev,
      ]);
      // Get local media
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsCallReady(true);
      } catch (err) {
        setEvents((prev) => [
          `Error accessing media devices: ${err}`,
          ...prev,
        ]);
      }
    }
  };

  // --- Leave room and cleanup ---
  const leaveRoom = () => {
    if (joinedRoom) {
      socket.emit("leave-room", joinedRoom);
      setEvents((prev) => [
        `You left room: ${joinedRoom}`,
        ...prev,
      ]);
      setJoinedRoom(null);
      setIsCallReady(false);
      endCall();
      // Stop local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    }
  };

  // --- Start WebRTC call (as caller) ---
  const startCall = async () => {
    if (!peerConnectionRef.current && localStreamRef.current) {
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;
      // Add local tracks
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
      });
      // ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("signal", { roomId: joinedRoom, data: event.candidate });
        }
      };
      // Remote stream
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("signal", { roomId: joinedRoom, data: offer });
    }
  };

  // --- End call and cleanup peer connection ---
  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  // --- Start call if ready and not already started ---
  useEffect(() => {
    if (isCallReady && joinedRoom && !peerConnectionRef.current) {
      // If you are the first user, wait for another to join
      // If you are the second, handleUserJoined will trigger startCall
    }
    // eslint-disable-next-line
  }, [isCallReady, joinedRoom]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Join a Room</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border rounded px-2 py-1 flex-1"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          disabled={!!joinedRoom}
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
          onClick={joinRoom}
          disabled={!!joinedRoom || !roomId.trim()}
        >
          Join
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-1 rounded disabled:opacity-50"
          onClick={leaveRoom}
          disabled={!joinedRoom}
        >
          Leave
        </button>
      </div>
      {joinedRoom && (
        <div className="mb-2 text-green-700">Joined room: <b>{joinedRoom}</b></div>
      )}
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div>
          <h3 className="font-semibold mb-2">Local Video</h3>
          <video ref={localVideoRef} autoPlay playsInline muted className="w-48 h-36 bg-black rounded" />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Remote Video</h3>
          <video ref={remoteVideoRef} autoPlay playsInline className="w-48 h-36 bg-black rounded" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Room Events</h3>
        <ul className="text-sm max-h-32 overflow-y-auto">
          {events.map((event, idx) => (
            <li key={idx}>{event}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 