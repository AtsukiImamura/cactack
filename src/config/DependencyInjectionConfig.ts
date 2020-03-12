import "reflect-metadata";
import { container } from "tsyringe";
import StabJournalRepository from "../repository/stab/StabJournalRepository";
import StabJournalDetailRepository from "../repository/stab/StabJournalDetailRepository";
import StabPropertyRepository from "../repository/stab/StabPropertyRepository";
import StabBadgetRepository from "../repository/stab/StabBadgetRepository";
import StabDepreciationRepository from "../repository/stab/StabDepreciationRepository";
import StabUserRepository from "../repository/stab/StabUserRepository";

export default class DependencyInjectionConfig {
  public static runProduction(): void {
    // container.register("JournalRepository", { useClass: JournalRepository });
  }

  public static runTest(): void {
    container.register("JournalRepository", {
      useClass: StabJournalRepository
    });
    container.register("PropertyRepository", {
      useClass: StabPropertyRepository
    });
    container.register("BadgetRepository", {
      useClass: StabBadgetRepository
    });
    container.register("DepreciationRepository", {
      useClass: StabDepreciationRepository
    });
    container.register("JournalDetailRepository", {
      useClass: StabJournalDetailRepository
    });
    container.register("UserRepository", {
      useClass: StabUserRepository
    });
  }
}
