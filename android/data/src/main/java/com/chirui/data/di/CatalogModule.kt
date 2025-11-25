package com.chirui.data.di

import com.chirui.data.catalog.AssetCatalogRepository
import com.chirui.domain.catalog.CatalogRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class CatalogModule {

    @Binds
    @Singleton
    abstract fun bindCatalogRepository(repository: AssetCatalogRepository): CatalogRepository
}
