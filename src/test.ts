import DependencyInjectionConfig from "./config/DependencyInjectionConfig";
import { container } from "tsyringe";
import JournalService from "./service/JournalService";
import IJournal from "./model/interface/IJournal";

DependencyInjectionConfig.runTest();
const service = container.resolve(JournalService);
service.saveJournal({} as IJournal);
