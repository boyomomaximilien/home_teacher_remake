import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { App } from '../app';
import { Discussion } from '../dashboard/discussion/discussion';

export class HandlerDiscussion {

    private readonly path = `/discussions/${App.connectedUserUid}`;
    discussionRef: AngularFireList<any>;

    constructor(private dbDiscussion: AngularFireDatabase) {
        this.discussionRef = this.dbDiscussion.list(this.path);
    }

    getAllDiscussions() {
        return this.discussionRef;
    }

    getDiscussionById(discussionId: string) {
        return this.dbDiscussion.object(`${this.path}/${discussionId}`);
    }

    updateDiscussion(discussionId: string, data: Discussion) {
        const discussionRef = this.dbDiscussion.object(`${this.path}/${discussionId}`);

    }

}
