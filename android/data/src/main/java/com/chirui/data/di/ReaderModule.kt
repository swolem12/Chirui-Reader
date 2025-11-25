package com.chirui.data.di

import com.chirui.data.reader.AssetReaderRepository
import com.chirui.domain.reader.ReaderRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent

@Module
@InstallIn(SingletonComponent::class)
interface ReaderModule {
    @Binds
    fun bindReaderRepository(impl: AssetReaderRepository): ReaderRepository
}
