// A totally framework-independent piece of application code.
// Nothing here is remotely associated with HTTP, Express or anything.
export class TodosService {
  constructor() {
    // We depend on the current user!
    // this.currentUser = currentUser;
    // this.db = db;
  }

  getTodos() {
    // use your imagination ;)
    // return this.db('todos').where('user', this.currentUser.id);

    return ['my first todo', 'my second todo', 'my third todo'];
  }
}
