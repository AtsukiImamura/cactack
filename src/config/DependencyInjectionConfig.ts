import "reflect-metadata";
import { container } from "tsyringe";
import JournalRepository from "../repository/JournalRepository";

export default class DependencyInjectionConfig {
  public static runProduction(): void {
    container.register("JournalRepository", { useClass: JournalRepository });
  }

  public static runTest(): void {
    container.register("JournalRepository", { useClass: JournalRepository });
  }
}
