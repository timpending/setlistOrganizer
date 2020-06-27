import { Component, OnInit } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable, of } from "rxjs";
import { tap, single } from "rxjs/operators";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import * as _ from "lodash";
import { ServiceService } from "./service.service";
import { forEach } from 'lodash';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "setlist";
  collection: AngularFirestoreCollection;
  items$: Observable<any[]>;
  songs$: Observable<any[]>;
  songs: any[] = [];
  actives: any[] = [];
  actives$: Observable<any[]>;
  inActives: any[] = [];
  inActives$: Observable<any[]>;
  showInactives: boolean = false;
  inSet: any[] = [];
  inSet$: Observable<any[]>;
  outSet: any[] = [];
  outsideSet$: Observable<any[]>;

  constructor(
    private firestore: AngularFirestore,
    private _service: ServiceService
  ) {
    this.items$ = firestore.collection("songs").valueChanges();
    this.collection = firestore.collection("songs");
  }

  ngOnInit() {
    this.items$.subscribe((items) => {
      this.songs = _.sortBy(items, ["order"]);
      this.actives$ =  of(_.sortBy(items.filter(item => item.isActive), ['order']));
      this.inActives$ = of(items.filter(item => !item.isActive));
      this.inSet$ =  of(_.sortBy(items.filter(item => item.isInSet && item.isActive), ['order']));
      this.inSet = _.sortBy(items.filter(item => item.isInSet && item.isActive), ['order']);
      this.outsideSet$ = of(_.sortBy(items.filter(item => !item.isInSet && item.isActive), ['order']));
    });
  }

  logCollection() {
    console.log(this.songs);
  }

  updateOrder(song: any, i: number) {
    this.firestore.collection('songs').doc(song.song).set({order: i}, {merge: true});
  }

  updateEntireOrder() {
    this.songs.forEach((song, i) => {
      this.firestore
        .collection("songs")
        .doc(song.song)
        .set({ order: i }, { merge: true });
    });
  }

  utility() {
    this.songs.forEach((song, i) => {
      if (song['isActive']) {
        this.firestore
        .collection("songs")
        .doc(song.song)
        .set({ isInSet: true }, { merge: true });
    }
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

  redoSetOrder(title: string) {
    this.inSet$.forEach(setlist => {
      setlist.forEach((song, i) => {
        this.updateOrder(song, i)
      })
    })
  };

  setInsideSet(title: string) {
    this.collection.doc(title).set({
      isInSet: true,
      order: 0
    }, {merge: true});
  };

  setOutsideSet(title: string) {
    this.collection.doc(title).set({
      isInSet: false,
      order: 0
    }, {merge: true});
  };

  setInactive(title: string) {
    this.collection.doc(title).set({
      isActive: false,
      order: 0
    }, {merge: true});
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

  toggleShowInactives() {
    this.showInactives = !this.showInactives;
  }


  drop(event: CdkDragDrop<any[]>) {
    const prevListId = event.previousContainer.id;
    const listId = event.container.id;
    const songTitle = event.item.element.nativeElement.id;

    if (prevListId === 'in-list' && listId === 'out-list') {
      this.setOutsideSet(songTitle);
    }
    if (prevListId === 'out-list' && listId === 'in-list') {
      this.setInsideSet(songTitle);
      this.redoSetOrder(songTitle);
    }
    if (prevListId === 'in-list' && listId === 'in-list') {
      this.redoSetOrder(songTitle);
    }
    
    moveItemInArray(this.songs, event.previousIndex, event.currentIndex);
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
