import {ObjectID} from 'bson';

const ADMIN_ID  = new ObjectID();
const PINKY_ID  = new ObjectID();
const BRAIN_ID  = new ObjectID();

const Coder = [{
  _id: ADMIN_ID,
  display: "Ad Minima",
  emails:  ['admin@example.com'],
  idents:  ['testauth:admin'],
  avatars: ['/assets/passed.png'],
  roles:   ['admin', 'comment'],
}, {
  _id: PINKY_ID,
  display: "Pinky",
  emails:  ['pinky@example.com'],
  idents:  ['testauth:pinky'],
  avatars: ['/assets/passed.png'],
  roles:   ['comment'],
}, {
  _id: BRAIN_ID,
  display: "The Brain",
  emails:  ['brain@example.com'],
  idents:  ['testauth:brain'],
  avatars: ['/assets/passed.png'],
  roles:   ['comment'],
}];

const Comment = [{
  _id: new ObjectID(),
  author: ADMIN_ID,
  created: new Date(),
  content: `
Don't shoot yourself in the <footer>
  <script>alert('bang!');</script>
</footer>`,
}];

const Post = [{
  _id: new ObjectID(),
  author: ADMIN_ID,
  comments: [Comment[0]._id],
  title: "Life is like a Sonnet",
  posted: new Date("February 10, 2017"),
  content: `Life, with its rules, its obligations, and its freedoms,
is like a sonnet:

> You're given the form, but you have to write the sonnet yourself.
> What you say is completely up to you.

&mdash; Mrs. Whatsit`,
  image: '/images/cover-1.png',
  path: 'life-is-like-a-sonnet',
},{
  _id: new ObjectID(),
  author: ADMIN_ID,
  comments: [],
  title: "America",
  posted: new Date("January 20, 2017"),
  content: `Electing Donald Trump as president was like
hiring a raccoon to take out our trash.
They both *try* to do their jobs but leave *us* with a mess to clean up.
Plus, they both have small hands and both look like thieves.`,
  image: '/images/cover-2.png',
  path: 'america',
}];

const Idea = [{
  _id: new ObjectID(),
  creator: PINKY_ID,
  owners: [PINKY_ID],
  created: new Date("April 16, 2017"),
  target: null,
  title: "Narf",
  body: "I think so, Brain.",
  completed: null,
  placement: 100,
  importance: 0,
}, {
  _id: new ObjectID(),
  creator: BRAIN_ID,
  owners: [BRAIN_ID],
  created: new Date("April 16, 2017"),
  target: new Date("April 16, 2018"),
  title: "Take over the world",
  body: "Escape this cage and take over the world.",
  completed: null,
  placement: 200,
  importance: 3000,
}];

export default {Coder, Comment, Post, Idea};
