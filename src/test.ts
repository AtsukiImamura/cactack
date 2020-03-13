import DependencyInjectionConfig from "./config/DependencyInjectionConfig";
import { container } from "tsyringe";
import JournalService from "./service/JournalService";
import Journal from "./model/Journal";

DependencyInjectionConfig.runLocal();
const service = container.resolve(JournalService);
service.insertJournal(Journal.cashOut(2345));
