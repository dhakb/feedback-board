export type FeedbackStatus = "OPEN" | "PLANNED" | "IN_PROGRESS" | "COMPLETED";


export interface FeedbackProps {
  id: string;
  title: string;
  description: string;
  category: string;
  status: FeedbackStatus;
  upvotes: number;
  authorId: string;
  createdAt?: Date;
}

export class Feedback {
  public id: string;
  public title: string;
  public description: string;
  public category: string;
  public status: FeedbackStatus;
  public upvotes: number;
  public authorId: string;
  public createdAt?: Date;

  constructor(props: FeedbackProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.category = props.category;
    this.status = props.status;
    this.upvotes = props.upvotes;
    this.authorId = props.authorId;
    this.createdAt = props.createdAt;
  }
}