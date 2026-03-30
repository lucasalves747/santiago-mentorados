CREATE TABLE `diagnosticos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL DEFAULT '',
	`email` varchar(320) DEFAULT '',
	`dados` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `diagnosticos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `diarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL DEFAULT '',
	`data` varchar(10) NOT NULL,
	`qualidadeSono` int DEFAULT 0,
	`energiaManha` int DEFAULT 0,
	`energiaTarde` int DEFAULT 0,
	`energiaNoite` int DEFAULT 0,
	`humorGeral` int DEFAULT 0,
	`nivelFoco` int DEFAULT 0,
	`dados` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `diarios_id` PRIMARY KEY(`id`)
);
