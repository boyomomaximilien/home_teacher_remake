export class Message {
    public Id!: string;
    public Content: string = "";
    public DiscussionId!: string;
    public SenderId!: string;
    public ReceiverId!: string;
    public DateTimeInfo!: Date;

    constructor(id: string, content: string, sender: string, receiver: string, dateAndTime: Date, discussionId: string) {
        this.Id = id;
        this.Content = content;
        this.DiscussionId = discussionId;
        this.SenderId = sender;
        this.ReceiverId = receiver;
        this.DateTimeInfo = dateAndTime;
    }
}
