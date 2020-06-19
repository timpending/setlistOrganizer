import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'setlist';
  items: Observable<any[]>;

  constructor(firestore: AngularFirestore) {
    this.items = firestore.collection('songs').valueChanges();
  
  }
}


// { 
//   "album-cover": "https://i.scdn.co/image/ab67616d0000b2735f6eca66c3be82e255b2e85f,https://i.scdn.co/image/ab67616d00001e025f6eca66c3be82e255b2e85f,https://i.scdn.co/image/ab67616d000048515f6eca66c3be82e255b2e85f", 
// "album-url": "https://open.spotify.com/album/3T8jR4mkcdaLCsyaP8nQ1r", 
// "release-date": 2000, 
// "artist": "Goldfinger", 
// "song-url": "https://open.spotify.com/track/0rOTMSSa6yscfOrGnzfheM", 
// "popularity": 62, 
// "song": "99 Red Balloons", 
// "duration": 229173, 
// "id": 0, 
// "album": "Stomping Ground", 
// "date-added": 2020 
// }