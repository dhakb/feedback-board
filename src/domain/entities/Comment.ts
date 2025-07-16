export interface CommentProps {
  id: string;
  content: string;
  authorId: string;
  feedbackId: string;
  createdAt?: Date;
}

export class Comment {
  public id: string;
  public content: string;
  public authorId: string;
  public feedbackId: string;
  public createdAt?: Date;

  constructor(props: CommentProps) {
    this.id = props.id;
    this.content = props.content;
    this.authorId = props.authorId;
    this.feedbackId = props.feedbackId;
    this.createdAt = props.createdAt;
  }
}