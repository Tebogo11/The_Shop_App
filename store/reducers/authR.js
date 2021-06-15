import { AUTHENTICATE, LOGIN, LOGOUT, SIGNUP } from "../actions/authA";

const initialState = {
  token: null,
  userId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
      };
    case LOGIN:
      return {
        token: action.token,
        userId: action.userId,
      };
    case SIGNUP:
      return {
        token: action.token,
        userId: action.userId,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

user = {
  UserID: 99,
  Email: "demo@live.co.uk",
  UserProject: [
    {
      ProjectID: "55",
      ProjectName: "Demo",
    },
  ],
  SavedProjects: [{ ProjectID: 55 }],
};

Projects = {
  ProjectID: 2001,
  ProjectName: "Demo",
  ProjectType: "Presentation",
  ProjectPages: [
    {
      Page1: [
        {
          OrderNum: 1,
          ContentType: "Text",
          Content: "Hello World",
        },
        {
          OrderNum: 2,
          ContentType: "Image",
          Content: "www.imagelocation.com",
        },
        {
          OrderNum: 3,
          ContentType: "Text",
          Content: "The bottom of the Page",
        },
      ],
    },
  ],
};
