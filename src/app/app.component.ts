import { Component } from '@angular/core';
import { Note } from './note';
import { NotesService } from './notes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  errMessage: string;
  note: Note;
  notes: Array<Note> = [];

  // Dependency Injection of Notes Service
  constructor(private notesService: NotesService) {
    this.note = new Note();
  }

  // Function to handle teh addition of note to db.json through addNote() in Notesservice
  takeNote() {
    // Displaying error of title or text of the note is blank on submission
    if (this.note.title === '' || this.note.text === '') {
      this.errMessage = 'Title and Text both are required fields';
    }
    // tslint:disable-next-line:one-line
    else {
      // to avoid delay, adding the data initially before adding it to server
      this.notes.push(this.note);
      this.errMessage = '';
      this.notesService.addNote(this.note).subscribe(
        (data) => {
          // Data is already added in notes array
        },
        // In case of failure, assigning the error message and reverting the added note
        (error) => {
          this.errMessage = error.message;
          const noteIndex = this.notes.findIndex(note => note.title === this.note.title);
          this.notes.splice(noteIndex, 1);
        }
      );
      this.note = new Note();
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // getNotes subscription for observable
    this.notesService.getNotes().subscribe(
      // On success pushing the response to notes
      (data) => {
        this.notes = data;
      },
      // On failure assigning the error message
      (error) => {
        this.errMessage = error.message;
      }
    );
  }
}

