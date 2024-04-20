
class PeerService {
    peer: RTCPeerConnection | null;
    constructor(){
        this.peer = new RTCPeerConnection({
            iceServers:[
                { urls: "stun:stun.l.google.com:19302" }, 
                { urls: "stun:stun.services.mozilla.com" }
            ]
        });
    }

    async getOffer(){
        if(!this.peer) {
            throw new Error("Peer connection is not initialized.");
        }

        try {
            const offer = await this.peer.createOffer();
            await this.peer.setLocalDescription(new RTCSessionDescription(offer));
            return this.peer.localDescription; // Return local description including ICE candidates
        } catch (error:any) {
            throw new Error("Failed to create offer: " + error.message);
        }
    }

    close() {
        if (this.peer) {
            this.peer.close();
            this.peer = null;
        }
    }
    async  getAnswer(offer:any){
        try{
            if (this.peer){
                await this.peer.setRemoteDescription(offer);
                const ans = await this.peer.createAnswer();
                await this.peer.setLocalDescription(new RTCSessionDescription(ans))
                return ans ;
            }
        }
        catch(error:any){

        }
    }
    async setLocalDescription(offer:any){
        if (this.peer){
            await this.peer.setRemoteDescription(new RTCSessionDescription(offer))
        }
    }
}

export default new PeerService();
