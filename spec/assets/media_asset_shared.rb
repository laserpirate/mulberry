shared_examples_for "all media assets" do
  describe '#item' do
    it "should handle output remote items properly" do
      item = @remote_asset.item
      item[:url].should match /^http/
      item[:streamed].should be_true
    end
  end
end
