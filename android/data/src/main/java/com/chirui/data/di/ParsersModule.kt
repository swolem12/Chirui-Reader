package com.chirui.data.di

import com.chirui.data.parsers.AssetParserRegistry
import com.chirui.parsers.ParserRegistry
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class ParsersModule {

    @Binds
    @Singleton
    abstract fun bindParserRegistry(registry: AssetParserRegistry): ParserRegistry
}
