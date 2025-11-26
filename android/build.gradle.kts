// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.5.0")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.9.24")
        classpath("com.google.dagger:hilt-android-gradle-plugin:2.51.1")
        classpath("org.jetbrains.kotlin:kotlin-serialization:1.9.24")
    }
}

// Apply ktlint to all subprojects
subprojects {
    apply(plugin = "org.jlleitschuh.gradle.ktlint")
}

plugins {
    id("org.jlleitschuh.gradle.ktlint") version "12.1.0" apply false
}

// Clean task for the root project
tasks.register("clean", Delete::class) {
    delete(rootProject.layout.buildDirectory)
}

// Aggregate task to run ktlint on all modules
tasks.register("ktlintCheckAll") {
    group = "verification"
    description = "Run ktlint checks on all modules"
    dependsOn(subprojects.map { it.tasks.findByName("ktlintCheck") })
}

// Aggregate task to format all modules with ktlint
tasks.register("ktlintFormatAll") {
    group = "formatting"
    description = "Run ktlint formatting on all modules"
    dependsOn(subprojects.map { it.tasks.findByName("ktlintFormat") })
}
