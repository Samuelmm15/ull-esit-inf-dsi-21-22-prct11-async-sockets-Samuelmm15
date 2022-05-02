/**
 * This is the class to define the notes objects.
 */
export class Note {
  /**
   * This is the constructor of the class.
   * @param title Consists in the title of the note.
   * @param body Consists in the body of the note.
   * @param colour Consists in the colour of the note.
   * @param userName Consists in the userName.
   */
  constructor(private title: string, private body: string,
    private colour: string, private userName: string) {
  }
  /**
   * Function that gets the title of the note.
   * @returns The title of the note.
   */
  getTitle(): string {
    return this.title;
  }
  /**
   * Function that gets the body of the note.
   * @returns The body of the note.
   */
  getBody(): string {
    return this.body;
  }
  /**
   * Function that gets the colour of the note.
   * @returns The colour of the note.
   */
  getColour(): string {
    return this.colour;
  }
  /**
   * Function that gets the user that makes the note.
   * @returns The user property of the note.
   */
  getUserName(): string {
    return this.userName;
  }
}
