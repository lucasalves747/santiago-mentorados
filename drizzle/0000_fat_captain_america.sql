CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "diagnosticos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) DEFAULT '' NOT NULL,
	"email" varchar(320) DEFAULT '',
	"dados" json NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) DEFAULT '' NOT NULL,
	"data" varchar(10) NOT NULL,
	"qualidadeSono" integer DEFAULT 0,
	"energiaManha" integer DEFAULT 0,
	"energiaTarde" integer DEFAULT 0,
	"energiaNoite" integer DEFAULT 0,
	"humorGeral" integer DEFAULT 0,
	"nivelFoco" integer DEFAULT 0,
	"dados" json NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
