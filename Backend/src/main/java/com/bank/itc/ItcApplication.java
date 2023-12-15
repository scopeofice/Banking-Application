package com.bank.itc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ItcApplication {

	public static void main(String[] args) {
		SpringApplication.run(ItcApplication.class, args);
	}

}
//@SpringBootApplication
//public class ItcApplication extends SpringBootServletInitializer {
//	public static void main(String[] args) {
//		SpringApplication.run(ItcApplication.class, args);
//	}
//
//	@Override
//	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
//		return builder.sources(ItcApplication.class);
//	}
//}
