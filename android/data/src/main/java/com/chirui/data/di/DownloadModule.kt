package com.chirui.data.di

import com.chirui.data.downloads.AssetDownloadRepository
import com.chirui.domain.downloads.DownloadRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class DownloadModule {

    @Binds
    @Singleton
    abstract fun bindDownloadRepository(
        impl: AssetDownloadRepository,
    ): DownloadRepository
}
