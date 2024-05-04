import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { getPersistConfig } from "redux-deep-persist";

import CustomizerReducer from "./customizer/CustomizerSlice";
import ChatsReducer from "./apps/chat/ChatSlice";
import NotesReducer from "./apps/notes/NotesSlice";
import EmailReducer from "./apps/email/EmailSlice";
import TicketReducer from "./apps/tickets/TicketSlice";
import ContactsReducer from "./apps/contacts/ContactSlice";
import EcommerceReducer from "./apps/eCommerce/EcommerceSlice";
import UserProfileReducer from "./apps/userProfile/UserProfileSlice";
import BlogReducer from "./apps/blog/BlogSlice";

// new
import CreativeReducer from "./apps/ad-management/CreativeSlice";
import SiteReducer from "./apps/ad-management/SiteSlice";
import AdUnitSlice from "./apps/ad-management/AdUnitSlice";
import SystemSlice from "./apps/system";
import GlobalSlice from "./apps/global/GlobalSlice";

// ----------------------------------------------------------------------
const rootReducer = combineReducers({
  customizer: CustomizerReducer,
  chatReducer: ChatsReducer,
  emailReducer: EmailReducer,
  notesReducer: NotesReducer,
  contactsReducer: ContactsReducer,
  ticketReducer: TicketReducer,
  ecommerceReducer: EcommerceReducer,
  userpostsReducer: UserProfileReducer,
  blogReducer: BlogReducer,

  // new
  global: GlobalSlice,
  creative: CreativeReducer,
  site: SiteReducer,
  adUnit: AdUnitSlice,
  system: SystemSlice,
});

const whileListSystemPage = ["customizer"];

const whileListCheckoutPage = [];

const rootPersistConfig = getPersistConfig({
  key: "root",
  storage: storage,
  keyPrefix: "redux-",
  whitelist: [...whileListSystemPage, ...whileListCheckoutPage],
  rootReducer,
});

export { rootPersistConfig, rootReducer };
