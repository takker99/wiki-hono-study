import logger from "./logger";
import { pushStateOnRoute, scrollTopOnRoute, validateOnRoute } from "./route";
import {
  adjustEditLineOnPageLines,
  getPageOnRoute,
  removeEmptyLines,
  sendPage,
  unsetEditLineOnRoute,
} from "./page";
import { getPageListOnRoute } from "./pagelist";
import { getRelatedPageListOnRoute } from "./related-pagelist";
import { cancelTitleEditOnRoute, onPageTitleSubmit } from "./title";
import { stopEditOnSocketDisconnect } from "./socket-connection";
import { updateTitle } from "./document";

export default [
  validateOnRoute,
  pushStateOnRoute,
  updateTitle,
  unsetEditLineOnRoute,
  getPageOnRoute,
  getPageListOnRoute,
  getRelatedPageListOnRoute,
  stopEditOnSocketDisconnect,
  removeEmptyLines,
  sendPage,
  adjustEditLineOnPageLines,
  onPageTitleSubmit,
  cancelTitleEditOnRoute,
  scrollTopOnRoute,
  logger,
];
