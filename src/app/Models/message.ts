export class Message {
    public Id: string = '';
    public Content: string = "";
    public DiscussionId: string = ''
    public SenderId: string = ''
    public ReceiverId: string = ''
    public Date: string = ''
    public Heure: string = ''
    public IdSuppresseurs: string[] = []

    constructor(id: string, content: string, sender: string, receiver: string, date: string, discussionId: string) {
        this.Id = id;
        this.Content = content;
        this.DiscussionId = discussionId;
        this.SenderId = sender;
        this.ReceiverId = receiver;
        this.Date = date;
    }
}
