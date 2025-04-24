import { useState, useRef, useEffect } from 'react';

const AudioChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  
  useEffect(() => {
    // Initialize WebRTC peer connection
    const configuration = { 
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ] 
    };
    
    peerConnectionRef.current = new RTCPeerConnection(configuration);
    
    // Set up connection handlers
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        // Send the ICE candidate to the backend via your signaling server
        sendToSignalingServer({
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      // Handle incoming audio tracks
      if (audioRef.current) {
        audioRef.current.srcObject = event.streams[0];
      }
    };

    // Clean up
    return () => {
      peerConnectionRef.current?.close();
      streamRef.current?.getTracks().forEach(track => track.stop());
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Set up MediaRecorder for local recording
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        chunksRef.current = [];
      };

      mediaRecorder.start();
      
      // Add the audio track to the peer connection
      stream.getAudioTracks().forEach(track => {
        if (peerConnectionRef.current) {
          peerConnectionRef.current.addTrack(track, stream);
        }
      });

      // Create and send offer
      if (peerConnectionRef.current) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        
        // Send the offer to the backend via your signaling server
        sendToSignalingServer({
          type: 'offer',
          offer: offer
        });
      }

      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  // Function to send messages to your signaling server
  const sendToSignalingServer = async (message: any) => {
    try {
      await fetch('SERVER_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });
    } catch (error) {
      console.error('Signaling error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">WebRTC Audio Chat</h2>
      
      <div className="space-y-4">
        <div className="w-full flex gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="w-full px-4 py-2 border-[1px] text-sm cursor-pointer border-gray-300 hover:bg-gray-200 rounded-md shadow-sm transition-colors"
          >
            {isRecording ? 'Stop Streaming' : 'Start Streaming'}
          </button>
          {recordedAudioUrl && (
            <button
              onClick={() => setRecordedAudioUrl(null)}
              className="w-full px-4 py-2 border-[1px] text-sm cursor-pointer bg-black text-white hover:bg-blue-600 rounded-md shadow-sm transition-colors"
            >
              Clear Recording
            </button>
          )}
        </div>

        {/* Recorded audio playback */}
        {recordedAudioUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Recorded Audio</h3>
            <audio 
              src={recordedAudioUrl} 
              controls 
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioChat;
