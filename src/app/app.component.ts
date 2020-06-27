import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import * as _ from "lodash";
import { ServiceService } from "./service.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "setlist";
  collection: AngularFirestoreCollection;
  items: Observable<any[]>;
  songs$: Observable<any[]>;
  songs: any[] = [];
  actives: any[] = [];
  actives$: Observable<any>;
  inActives: any[] = [];
  inActives$: Observable<any>;

  constructor(
    private firestore: AngularFirestore,
    private _service: ServiceService
  ) {
    this.items = firestore.collection("songs").valueChanges();
    this.collection = firestore.collection("songs");
  }

  ngOnInit() {
    this.items.subscribe((items) => {
      this.songs = _.sortBy(items, ["order"]);
      this.actives$ = of(items.filter(item => item.isActive));
      this.inActives$ = of(items.filter(item => !item.isActive));
    });
  }

  logCollection() {
    console.log(this.songs);
  }

  updateOrder() {
    this.songs.forEach((song, i) => {
      this.firestore
        .collection("songs")
        .doc(song.song)
        .set({ order: i }, { merge: true });
    });
  }

  setActive() {
    this.songs.forEach((song, i) => {
      this.firestore
        .collection("songs")
        .doc(song.song)
        .set({ isActive: true }, { merge: true });
    });
  }

  songLengthConversionDisplay(duration: string) {
    let ms = parseInt(duration);
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    //let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    //let hoursDisplay = (hours < 10) ? "0" + hours : hours;
    //let minutesDisplay = (minutes < 10) ? "0" + minutes : minutes;
    let secondsDisplay = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + secondsDisplay;
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log(event);
    moveItemInArray(this.songs, event.previousIndex, event.currentIndex);
    this.updateOrder();
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
