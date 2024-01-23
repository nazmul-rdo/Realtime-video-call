import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";




function ParticipantView(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);
    
console.log(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
      {webcamOn && (
        <ReactPlayer
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          url={videoStream}
          height={"300px"}
          width={"300px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function MeetingView() {
const [joined, setJoined] = useState(null);
//Get the method which will be used to join the meeting.
//We will also get the participants list to display all participants
const { join, participants } = useMeeting({
  //callback for when meeting is joined successfully
  onMeetingJoined: () => {
    setJoined("JOINED");
  }
});
const joinMeeting = () => {
  setJoined("JOINING");
  join();
};
return (
  <div className="container">
    {joined && joined === "JOINED" ? (
      <div>
        {[...participants.keys()].map((participantId) => (
          <ParticipantView
            participantId={participantId}
            key={participantId}
          />
        ))}
      </div>
    ) : joined && joined === "JOINING" ? (
      <p>Joining the meeting...</p>
    ) : (
      

      <Home joinMeeting={joinMeeting} />
      
    )}
  </div>
);
}

const Home =({joinMeeting, participantId})=>{
  return(
    <>
    
    <button onClick={joinMeeting}>Join the meeting</button>
  
    
    </>
  )
}





const App = () => {
  return (
    <MeetingProvider
      config={{
        meetingId: "n1qp-h69l-70xa",
        micEnabled: true,
        webcamEnabled: true,
        name: "Nazmul's Org",
      }}
      token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIwM2FkYjgwYi03MTk1LTRkMWYtODdkNy1hNDA3ODg5MTdiNDQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwNTk4NDg2MSwiZXhwIjoxNzIxNTM2ODYxfQ.RYGhEzPaVtD_DGg-uX8yklHaaffjLgEnngAU9m5nJDU"
    >
      <MeetingView />
    </MeetingProvider>
  )
};
export default App;