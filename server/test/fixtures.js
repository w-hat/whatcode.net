import {ObjectID} from 'bson';

const ADMIN_ID  = new ObjectID();

const Coder = [{
  _id: ADMIN_ID,
  display: "Ad Minima",
  emails:  ['admin@exmaple.com'],
  idents:  ['testauth-123'],
  avatars: ['/assets/passed.png'],
  roles:   ['admin', 'comment'],
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

export default {Coder, Comment, Post};
