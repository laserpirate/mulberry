require 'spec/spec_helper'
require 'assets/base_shared'
require 'assets/media_asset_shared'
require 'fakefs/spec_helpers'

describe Mulberry::Asset::Image do

  describe 'base behavior' do
    include FakeFS::SpecHelpers

    before :each do
      @asset = Factory.build :image
    end

    it_should_behave_like "all assets"
  end

  describe 'media asset behavior' do
    include FakeFS::SpecHelpers

    before :each do
      @remote_asset = Factory.build :image_remote
    end

    it_should_behave_like "all media assets"
  end

end